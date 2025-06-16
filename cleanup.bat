@echo off
echo Cleaning up unnecessary files from Shuddhi Farms website project...
echo.

REM Creating backup directory first
mkdir backup_files
echo Created backup directory for files before removal

REM Moving email testing and troubleshooting files
echo Moving email testing and troubleshooting files to backup...
move check_email_settings.py backup_files\
move direct_gmail_test.py backup_files\
move direct_send.bat backup_files\
move direct_send.py backup_files\
move direct_test.bat backup_files\
move direct_test_gmail.py backup_files\
move email_config_options.py backup_files\
move email_troubleshooter.py backup_files\
move email_wizard.bat backup_files\
move gmail_security_checklist.md backup_files\
move gmail_setup_guide.md backup_files\
move gmail_troubleshooting.md backup_files\
move multi_recipient_test.py backup_files\
move multi_test.bat backup_files\
move sendgrid_setup_guide.md backup_files\
move sendgrid_troubleshooter.py backup_files\
move setup_email.bat backup_files\
move setup_email.sh backup_files\
move test_all_email.bat backup_files\
move test_gmail.bat backup_files\
move test_gmail.py backup_files\
move test_gmail_detailed.py backup_files\
move test_settings.py backup_files\
move troubleshoot_email.bat backup_files\
move troubleshoot_email.sh backup_files\

REM Moving VS Code setup/reset scripts
echo Moving VS Code setup/reset scripts to backup...
move ADD_TO_VSCODE.md backup_files\
move farm-website.code-workspace backup_files\
move open_folder.bat backup_files\
move reopen_vscode.bat backup_files\
move reset_vscode.bat backup_files\

REM Moving server start duplicates
echo Moving duplicate server scripts to backup...
move check_server.py backup_files\
move check_settings.bat backup_files\
move run_django_diagnostic.bat backup_files\
move run_django_server.ps1 backup_files\
move setup_and_run.py backup_files\
move start_django_server.bat backup_files\
move start_server.bat backup_files\
move test_visibility.txt backup_files\

REM Moving diagnostic scripts
echo Moving diagnostic scripts to backup...
move django_diagnostic.py backup_files\

REM Moving backup files
echo Moving backup files...
move static\youtube-integration.js.bak backup_files\
move debug.log backup_files\

REM Clean up unnecessary static files
echo Cleaning up unnecessary static files...
move static\youtube-integration-simplified.js backup_files\

echo.
echo Cleanup complete! All removed files have been moved to the 'backup_files' folder.
echo If you need any of these files later, you can restore them from this folder.
echo.
pause
