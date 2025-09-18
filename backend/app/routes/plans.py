# --- Plan Management Routes ---
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.database.session import get_db
from app.database.models.plan import Plan
from app.schemas.plan import PlanCreate, PlanUpdate, PlanOut
from app.core.security import get_current_admin

router = APIRouter(prefix="/plans", tags=["Plans"])

# --- Create a plan
@router.post("/", response_model=PlanOut)
def create_plan(plan: PlanCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    new_plan = Plan(**plan.model_dump())
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

# --- Read all plans
@router.get("/", response_model=List[PlanOut])
def get_all_plans(db: Session = Depends(get_db)):
    return db.query(Plan).all()

# --- Get a single plan by ID
@router.get("/{plan_id}", response_model=PlanOut)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

# --- Update a plan
@router.put("/{plan_id}", response_model=PlanOut)
def update_plan(plan_id: int, updates: PlanUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(plan, field, value)

    db.commit()
    db.refresh(plan)
    return plan

# --- Delete a plan
@router.delete("/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(plan)
    db.commit()
    return {"message": f"Plan {plan_id} deleted"}
