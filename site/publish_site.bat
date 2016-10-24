@echo off
rem 繰り返し実行可能なコンパイルバッチ
rem http://d.hatena.ne.jp/language_and_engineering/20081208/1228708657

:start
echo パブリッシュします・・・


rem 完成品用のディレクトリをクリーン
if exist "publish" rmdir /s /q publish
mkdir publish


rem パブリッシュ
cscript.exe publish_site.js
echo 完了

rem 
echo.
set userkey=
set /p userkey=終了する (Enter) / 再度パブリッシュ (p + Enter) ?
if not '%userkey%'=='' set userkey=%userkey:~0,1%
if '%userkey%'=='p' goto start
goto quit


rem 終了
:quit

