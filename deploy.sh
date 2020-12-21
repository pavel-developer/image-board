cd frontend
npm i
npm run build
cd ..
mkdir -p backend/public
rm -rf backend/public
cp -r frontend/dist/frontend backend/public
cd backend
npm i
npm run build
node build
