@echo off
rem �J��Ԃ����s�\�ȃR���p�C���o�b�`
rem http://d.hatena.ne.jp/language_and_engineering/20081208/1228708657

:start
echo �p�u���b�V�����܂��E�E�E


rem �����i�p�̃f�B���N�g�����N���[��
if exist "publish" rmdir /s /q publish
mkdir publish


rem �p�u���b�V��
cscript.exe publish_site.js
echo ����

rem 
echo.
set userkey=
set /p userkey=�I������ (Enter) / �ēx�p�u���b�V�� (p + Enter) ?
if not '%userkey%'=='' set userkey=%userkey:~0,1%
if '%userkey%'=='p' goto start
goto quit


rem �I��
:quit

