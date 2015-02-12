@echo Erasing Lunchr Database
mongo lunchr --eval "printjson(db.dropDatabase())"
pause