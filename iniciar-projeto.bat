@echo off
echo =======================================================
echo          INICIANDO O PROJETO ALUGUEL FAMILIAR
echo =======================================================
echo.
echo [1/2] Instalando dependencias (next-auth incluido)...
call npm install --no-fund --no-audit

echo.
echo [2/2] Ligando o servidor web...
echo O seu navegador vai abrir em alguns segundos!
echo Mantenha esta janela preta aberta.
echo.

timeout /t 4 /nobreak >nul
start http://localhost:3000

call npm run dev
