; Witchy CLI NSIS Installer Script
; This script creates a Windows installer for Witchy CLI

!include "MUI2.nsh"

; Installer configuration
Name "Witchy CLI"
OutFile "..\dist\WitchyCLI-Setup-${VERSION}.exe"
InstallDir "$PROGRAMFILES64\WitchyCLI"
InstallDirRegKey HKLM "Software\WitchyCLI" "Install_Dir"
RequestExecutionLevel admin

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

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
VIAddVersionKey "FileDescription" "Magical Correspondence Lookup Tool"
VIAddVersionKey "FileVersion" "1.0.0"
VIAddVersionKey "ProductVersion" "1.0.0"
VIAddVersionKey "LegalCopyright" "© 2025"

; Installer Sections
Section "Witchy CLI (required)"
  SectionIn RO
  
  ; Set output path to the installation directory
  SetOutPath $INSTDIR
  
  ; Copy the executable
  File "..\dist\witchy-cli-win.exe"
  
  ; Rename to simpler name
  Rename "$INSTDIR\witchy-cli-win.exe" "$INSTDIR\witchy.exe"
  
  ; Write the installation path into the registry
  WriteRegStr HKLM "Software\WitchyCLI" "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "DisplayName" "Witchy CLI"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI" "NoRepair" 1
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
SectionEnd

; Optional section (can be disabled by the user)
Section "Add to PATH"
  ; Add installation directory to PATH
  EnVar::SetHKLM
  EnVar::AddValue "PATH" "$INSTDIR"
  Pop $0
SectionEnd

Section "Start Menu Shortcuts"
  CreateDirectory "$SMPROGRAMS\Witchy CLI"
  CreateShortcut "$SMPROGRAMS\Witchy CLI\Witchy CLI.lnk" "$INSTDIR\witchy.exe"
  CreateShortcut "$SMPROGRAMS\Witchy CLI\Uninstall.lnk" "$INSTDIR\uninstall.exe"
SectionEnd

Section "Desktop Shortcut"
  CreateShortcut "$DESKTOP\Witchy CLI.lnk" "$INSTDIR\witchy.exe"
SectionEnd

; Uninstaller Section
Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\WitchyCLI"
  DeleteRegKey HKLM "Software\WitchyCLI"
  
  ; Remove files and uninstaller
  Delete "$INSTDIR\witchy.exe"
  Delete "$INSTDIR\witchy.db"
  Delete "$INSTDIR\uninstall.exe"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\Witchy CLI\*.*"
  Delete "$DESKTOP\Witchy CLI.lnk"
  
  ; Remove directories
  RMDir "$SMPROGRAMS\Witchy CLI"
  RMDir "$INSTDIR"
  
  ; Remove from PATH
  EnVar::SetHKLM
  EnVar::DeleteValue "PATH" "$INSTDIR"
  Pop $0
SectionEnd
