@echo off
REM Build Windows Installer Script
REM Requires NSIS to be installed and in PATH

echo ========================================
echo Building Witchy CLI Windows Installer
echo ========================================
echo.

REM Step 1: Build the executable
echo [1/2] Building executable...
call npm run build:exe:all
if errorlevel 1 (
    echo ERROR: Failed to build executable
    exit /b 1
)
echo.

REM Step 2: Build the installer
echo [2/2] Creating installer with NSIS...
makensis /DVERSION=1.0.0 installers\windows-installer.nsi
if errorlevel 1 (
    echo ERROR: Failed to create installer
    echo Make sure NSIS is installed and in your PATH
    exit /b 1
)
echo.

echo ========================================
echo Build complete!
echo Installer: dist\WitchyCLI-Setup-1.0.0.exe
echo ========================================
