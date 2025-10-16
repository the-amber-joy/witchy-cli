; Witchy CLI NSIS Installer Script
; This script creates a Windows installer for Witchy CLI

!include "MUI2.nsh"
!include "WordFunc.nsh"

; Installer configuration
Name "Witchy CLI"
OutFile "..\dist\WitchyCLI-Setup-${VERSION}.exe"
InstallDir "$PROGRAMFILES64\WitchyCLI"
InstallDirRegKey HKLM "Software\WitchyCLI" "Install_Dir"
RequestExecutionLevel admin

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "..\assets\icon.ico"
!define MUI_UNICON "..\assets\icon.ico"

; Pages
!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "Witchy CLI"
VIAddVersionKey "CompanyName" "Amber Joy"
VIAddVersionKey "FileDescription" "Witchy CLI Installer - Magical Correspondence Lookup Tool"
VIAddVersionKey "FileVersion" "1.0.0"
VIAddVersionKey "ProductVersion" "1.0.0"
VIAddVersionKey "LegalCopyright" "© 2025 Amber Joy"
VIAddVersionKey "LegalTrademarks" ""
VIAddVersionKey "Publisher" "Amber Joy"
VIAddVersionKey "Comments" "Open source magical correspondence tool. Visit github.com/the-amber-joy/witchy-cli"
VIAddVersionKey "OriginalFilename" "WitchyCLI-Setup-${VERSION}.exe"

; Installer Sections
Section "Witchy CLI (required)"
  SectionIn RO
  
  ; Set output path to the installation directory
  SetOutPath $INSTDIR
  
  ; Copy the executable
  File "..\dist\witchy-cli-win.exe"
  
  ; Copy the icon file
  File "..\assets\icon.ico"
  
  ; Rename to simpler name
  Rename "$INSTDIR\witchy-cli-win.exe" "$INSTDIR\witchy.exe"
  
  ; Write the installation path into the registry
  WriteRegStr HKLM "Software\WitchyCLI" "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "DisplayName" "Witchy CLI"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "DisplayIcon" "$INSTDIR\icon.ico"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "Publisher" "Amber Joy"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "NoRepair" 1
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
SectionEnd

; Optional section (can be disabled by the user)
Section "Add to PATH"
  ; Add installation directory to PATH using native NSIS commands
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  StrCpy $0 "$0;$INSTDIR"
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $0
  ; Broadcast WM_WININICHANGE to notify applications
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
SectionEnd

Section "Start Menu Shortcuts"
  CreateDirectory "$SMPROGRAMS\Witchy CLI"
  CreateShortcut "$SMPROGRAMS\Witchy CLI\Witchy CLI.lnk" "$INSTDIR\witchy.exe" "" "$INSTDIR\icon.ico" 0
  CreateShortcut "$SMPROGRAMS\Witchy CLI\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\icon.ico" 0
SectionEnd

Section "Desktop Shortcut"
  CreateShortcut "$DESKTOP\Witchy CLI.lnk" "$INSTDIR\witchy.exe" "" "$INSTDIR\icon.ico" 0
SectionEnd

; Uninstaller Section
Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI"
  DeleteRegKey HKLM "Software\WitchyCLI"
  
  ; Remove files and uninstaller
  Delete "$INSTDIR\witchy.exe"
  Delete "$INSTDIR\witchy.db"
  Delete "$INSTDIR\icon.ico"
  Delete "$INSTDIR\uninstall.exe"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\Witchy CLI\*.*"
  Delete "$DESKTOP\Witchy CLI.lnk"
  
  ; Remove directories
  RMDir "$SMPROGRAMS\Witchy CLI"
  RMDir /r "$INSTDIR"
  
  ; Remove from PATH using native NSIS commands
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  ${WordReplace} $0 ";$INSTDIR" "" "+" $0
  ${WordReplace} $0 "$INSTDIR;" "" "+" $0
  ${WordReplace} $0 "$INSTDIR" "" "+" $0
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $0
  ; Broadcast WM_WININICHANGE to notify applications
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
SectionEnd
