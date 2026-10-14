# Ověření zjednodušení 14. 10. 2026

Kontroly probíhaly v prohlížeči Codex proti místnímu HTTP serveru na `127.0.0.1:8004`. Nejde o ověření produkčního nasazení ani dalších prohlížečů. Nevznikla nová sada automatizovaných testů.

## 1. Galerie bez Font Awesome

Odstraněn import knihovny a dekorativní ikona; tlačítko má dál popisek „Filtrovat“. V okně 1440 × 900 px filtr OS2 zobrazil a načetl všech 29 obrázků, při 320 × 800 px filtr OS1 všech 17. Ověřen tmavý i světlý motiv, žádné vodorovné přetečení a žádné chyby v konzoli při této kontrole. DOM již neobsahuje odkaz na Font Awesome.
