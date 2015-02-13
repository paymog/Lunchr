echo "Erasing Lunchr Database"
mongo lunchr --eval "printjson(db.dropDatabase())"
read -p "Press [Enter] key to exit..."
