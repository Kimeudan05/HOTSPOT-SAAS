# Backend

cd backend
python -m venv virtual_env
pip install -r backend/requirements.txt

pytest backend/tests -v -s

# Frontend

cd ../frontend
npm install
npm run dev
