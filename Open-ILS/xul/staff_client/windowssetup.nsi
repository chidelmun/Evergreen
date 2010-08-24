; Script generated by the HM NIS Edit Script Wizard.

; HM NIS Edit Wizard helper defines
!define PRODUCT_NAME "Evergreen Staff Client"
; Old versions of makensis don't like this, moved to Makefile
;!define /file PRODUCT_VERSION "client/VERSION"
!define PRODUCT_PUBLISHER "Evergreen Community"
!define PRODUCT_WEB_SITE "http://evergreen-ils.org/"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\evergreen.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"
!define PRODUCT_STARTMENU_REGVAL "NSIS:StartMenuDir"

; MUI 1.67 compatible ------
!include "MUI.nsh"

; File Functions
!include "FileFunc.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Language Selection Dialog Settings
!define MUI_LANGDLL_REGISTRY_ROOT "${PRODUCT_UNINST_ROOT_KEY}"
!define MUI_LANGDLL_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_LANGDLL_REGISTRY_VALUENAME "NSIS:Language"

; Welcome page
!insertmacro MUI_PAGE_WELCOME
; License page
!insertmacro MUI_PAGE_LICENSE "..\..\..\LICENSE.txt"
; Components page
!ifdef AUTOUPDATE | DEVELOPER
!insertmacro MUI_PAGE_COMPONENTS
!endif
; Directory page
!insertmacro MUI_PAGE_DIRECTORY
; Start menu page
var ICONS_GROUP
!define MUI_STARTMENUPAGE_NODISABLE
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "Evergreen Staff Client Trunk"
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "${PRODUCT_UNINST_ROOT_KEY}"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "${PRODUCT_STARTMENU_REGVAL}"
!insertmacro MUI_PAGE_STARTMENU Application $ICONS_GROUP
; Instfiles page
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\evergreen.exe"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "Czech"
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "French"

; MUI end ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "evergreen_staff_client_setup.exe"
InstallDir "$PROGRAMFILES\Evergreen Staff Client Trunk"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin

Section "Staff Client" SECMAIN
  SetOutPath "$INSTDIR"
  File /r /x "autoupdate.js" /x "autochannel.js" /x "developers.js" "client\*"

; Shortcuts
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  CreateDirectory "$SMPROGRAMS\$ICONS_GROUP"
  !ifdef WICON
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Evergreen Staff Client.lnk" "$INSTDIR\evergreen.exe" "" "$INSTDIR\evergreen.ico"
  !ifdef PROFILES
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Evergreen Staff Client Profile Manager.lnk" "$INSTRDIR\evergreen.exe -profilemanager" "" "$INSTDIR\evergreen.ico"
  !endif
  !else
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Evergreen Staff Client.lnk" "$INSTDIR\evergreen.exe"
  !ifdef PROFILES
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Evergreen Staff Client Profile Manager.lnk" "$INSTRDIR\evergreen.exe -profilemanager"
  !endif
  !endif
  CreateShortCut "$DESKTOP\Evergreen Staff Client Trunk.lnk" "$INSTDIR\evergreen.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

!ifdef AUTOUPDATE
Section /o "Automatic Update" SECAUTO
  SetOutPath "$INSTDIR\defaults\preferences"
  File "client\defaults\preferences\autoupdate.js"
  File "client\defaults\preferences\autochannel.js"
  SetOutPath "$INSTDIR"
SectionEnd
!endif

!ifdef DEVELOPER
Section /o "Developer Options" SECDEV
  SetOutPath "$INSTDIR\defaults\preferences"
  File "client\defaults\preferences\developers.js"
  SetOutPath "$INSTDIR"
SectionEnd
!endif


Function .onInit
  !insertmacro MUI_LANGDLL_DISPLAY
  SectionSetFlags ${SECMAIN} 17
  ; This is mainly for silent installs
  !ifdef AUTOUPDATE | DEVELOPER
    Var /GLOBAL CMD_ARGS
    StrCpy $CMD_ARGS ""
    ${GetParameters} $CMD_ARGS
    !ifdef AUTOUPDATE
      !ifdef AUTOUPDATE_NODEFAULT
        ${GetOptions} $CMD_ARGS "/autoupdate" $0
        IfErrors +2 0
      !else
        ${GetOptions} $CMD_ARGS "/noautoupdate" $0
        IfErrors 0 +2
      !endif
      SectionSetFlags ${SECAUTO} 1
    !endif
    !ifdef DEVELOPER
      ${GetOptions} $CMD_ARGS "/developer" $0
      IfErrors +2 0
      SectionSetFlags ${SECDEV} 1
    !endif
  !endif
FunctionEnd

Section -AdditionalIcons
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  WriteIniStr "$INSTDIR\${PRODUCT_NAME}.url" "InternetShortcut" "URL" "${PRODUCT_WEB_SITE}"
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Website.lnk" "$INSTDIR\${PRODUCT_NAME}.url"
  CreateShortCut "$SMPROGRAMS\$ICONS_GROUP\Uninstall.lnk" "$INSTDIR\uninst.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\evergreen.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\evergreen.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SECMAIN} "The Evergreen Staff Client with XULRunner, Required"
  !ifdef AUTOUPDATE
  !insertmacro MUI_DESCRIPTION_TEXT ${SECAUTO} "Automatic Update Functionality"
  !endif
  !ifdef DEVELOPER
  !insertmacro MUI_DESCRIPTION_TEXT ${SECDEV}  "Developer Options"
  !endif
!insertmacro MUI_FUNCTION_DESCRIPTION_END


Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) was successfully removed from your computer."
FunctionEnd

Function un.onInit
!insertmacro MUI_UNGETLANGUAGE
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?" IDYES +2
  Abort
FunctionEnd

Section Uninstall
  !insertmacro MUI_STARTMENU_GETFOLDER "Application" $ICONS_GROUP
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\evergreen.exe"
  Delete "$INSTDIR\application.ini"
  Delete "$INSTDIR\BUILD_ID"
  Delete "$INSTDIR\STAMP_ID"
  Delete "$INSTDIR\VERSION"
  Delete "$INSTDIR\install.rdf"
  Delete "$INSTDIR\active-update.xml"
  Delete "$INSTDIR\chrome.manifest"
  Delete "$INSTDIR\updates.xml"
  Delete "$INSTDIR\log.txt"

  Delete "$SMPROGRAMS\$ICONS_GROUP\Uninstall.lnk"
  Delete "$SMPROGRAMS\$ICONS_GROUP\Website.lnk"
  Delete "$DESKTOP\Evergreen Staff Client Trunk.lnk"
  Delete "$SMPROGRAMS\$ICONS_GROUP\Evergreen Staff Client.lnk"

  RMDir "$SMPROGRAMS\$ICONS_GROUP"
  RMDir /r "$INSTDIR\updates"
  RMDir /r "$INSTDIR\xulrunner"
  RMDir /r "$INSTDIR\extensions"
  RMDir /r "$INSTDIR\chrome"
  RMDir /r "$INSTDIR\components"
  RMDir /r "$INSTDIR\defaults"
  RMDir "$INSTDIR"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd
