@echo off
cd /d "C:\Users\speed\Desktop\OnePlace Enterprise"
call "C:\Users\speed\AppData\Roaming\npm\firebase.cmd" login --reauth
call "C:\Users\speed\AppData\Roaming\npm\firebase.cmd" use oneplace-c3ac8
call "C:\Users\speed\AppData\Roaming\npm\firebase.cmd" deploy --only firestore:rules --project oneplace-c3ac8
