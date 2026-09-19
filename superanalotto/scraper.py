"""
Scraper archivio SuperEnalotto — superestrazione.it
Esegui: pip install requests beautifulsoup4
"""
import json
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime

BASE_URL = "https://www.superestrazione.it/archivio/"
HEADERS  = {"User-Agent": "Mozilla/5.0 (research/statistics project)"}

def scrape_page(url: str) -> list[dict]:
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    results = []
    # Adatta il selettore alla struttura reale della pagina
    for row in soup.select("table tr"):
        cols = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cols) < 7:          # data + 6 numeri (+ jolly eventuale)
            continue
        try:
            entry = {
                "data": cols[0],
                "numeri": [int(cols[i]) for i in range(1, 7)],
            }
            if len(cols) >= 8:     # jolly, se presente
                entry["jolly"] = int(cols[7])
            results.append(entry)
        except ValueError:
            continue               # intestazione o riga non numerica
    return results

def scrape_all(start_year: int = 2009, end_year: int = 2025) -> list[dict]:
    all_data = []
    for year in range(start_year, end_year + 1):
        url = f"{BASE_URL}?anno={year}"
        print(f"  Scaricando {year}…", end=" ")
        try:
            rows = scrape_page(url)
            print(f"{len(rows)} estrazioni trovate")
            all_data.extend(rows)
        except Exception as e:
            print(f"ERRORE: {e}")
        time.sleep(1)          # pausa cortese tra le richieste
    return all_data

if __name__ == "__main__":
    print("=== Scraper SuperEnalotto ===")
    data = scrape_all()

    # Ordina per data
    data.sort(key=lambda x: x["data"])

    output_file = "superenalotto_2009_2025.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Salvate {len(data)} estrazioni in '{output_file}'")