npm i -g @angular/cli@v8
npm i -g typescript

cd frontend
npm i
npm run build
cd ..
mkdir -p backend/public
rm -rf backend/public
cp -r frontent/dist/frontent backend/public
cd backend
npm i
npm run build
node build
