#!/usr/bin/env python3
"""Scraper for VietBiblio/OpenBiblio — Thư Viện THPT Dương Đông (stdlib only)"""
import urllib.request
import urllib.parse
import re
import json
import time
import ssl

BASE = "https://tvthptduongdong.vsl.vn/lms"
SEARCH = f"{BASE}/shared/biblio_search.php"
VIEW   = f"{BASE}/shared/biblio_view.php"

# Skip SSL verification for this internal site
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch(url, post_data=None):
    """Fetch URL, return decoded text."""
    if post_data:
        data = urllib.parse.urlencode(post_data).encode('utf-8')
        req = urllib.request.Request(url, data=data)
    else:
        req = urllib.request.Request(url)
    req.add_header('User-Agent', 'Mozilla/5.0')
    resp = urllib.request.urlopen(req, context=ctx, timeout=15)
    return resp.read().decode('utf-8', errors='replace')

def strip(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html)).strip()

def main():
    print("🚀 Bắt đầu cào dữ liệu Thư Viện THPT Dương Đông...")

    # 1) Fetch page 1 search (empty = all)
    print("📄 Tải trang tìm kiếm chính...")
    html = fetch(SEARCH, {"searchType":"keyword","searchText":"","submit":"Tìm"})
    
    with open("debug_page1.html","w",encoding="utf-8") as f:
        f.write(html)
    print("   → Lưu debug HTML → debug_page1.html")

    # 2) Find all biblio IDs on page
    bib_ids = list(set(re.findall(r'bibid=(\d+)', html)))
    print(f"   → Trang 1: tìm thấy {len(bib_ids)} bibid")
    
    # 3) Find pagination
    page_nums = sorted(set(int(p) for p in re.findall(r'page=(\d+)', html)))
    max_pg = max(page_nums) if page_nums else 1
    print(f"   → Phân trang: {max_pg} trang")
    
    for pg in range(2, max_pg + 1):
        print(f"📄 Tải trang {pg}/{max_pg}...")
        try:
            h = fetch(f"{SEARCH}?page={pg}&searchType=keyword&searchText=")
            ids = re.findall(r'bibid=(\d+)', h)
            bib_ids.extend(ids)
            print(f"   → {len(ids)} bibid")
        except Exception as e:
            print(f"   ❌ Lỗi: {e}")
        time.sleep(0.3)
    
    bib_ids = sorted(set(bib_ids), key=int)
    print(f"\n📚 Tổng số sách (unique bibid): {len(bib_ids)}")

    # 4) Fetch each book detail
    books = []
    errors = 0
    for i, bid in enumerate(bib_ids):
        if i % 100 == 0:
            print(f"🔍 Chi tiết: {i}/{len(bib_ids)} ...")
        try:
            h = fetch(f"{VIEW}?bibid={bid}")
            b = {"bibid": bid}
            
            # Parse all <td class="primary"> cells
            cells = re.findall(r'<td[^>]*class="primary"[^>]*>(.*?)</td>', h, re.DOTALL)
            raw = [strip(c) for c in cells if strip(c)]
            
            # Try structured extraction from MARC-style tags
            # Title
            m = re.search(r'Nhan đề.*?<td[^>]*>(.*?)</td>|245.*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["title"] = strip(m.group(1) or m.group(2))
            
            # Author
            m = re.search(r'Tác giả.*?<td[^>]*>(.*?)</td>|100.*?<a[^>]*>(.*?)</a>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["author"] = strip(m.group(1) or m.group(2))
            
            # DDC
            m = re.search(r'(?:Chỉ số phân loại|DDC|082|090).*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["ddc"] = strip(m.group(1))
            
            # Subject  
            m = re.search(r'(?:Chủ đề|650).*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["subject"] = strip(m.group(1))
                
            # Keywords
            m = re.search(r'(?:Từ khóa|653).*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["keywords"] = strip(m.group(1))
            
            # Collection
            m = re.search(r'(?:Bộ sưu tập|Kho|Collection).*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["collection"] = strip(m.group(1))
                
            # Publisher
            m = re.search(r'(?:Nhà xuất bản|NXB|260).*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["publisher"] = strip(m.group(1))
            
            # Year
            m = re.search(r'(?:Năm xuất bản|Năm XB).*?(\d{4})', h, re.IGNORECASE)
            if m:
                b["year"] = m.group(1)
                
            # Barcode / DKCB
            m = re.search(r'(?:ĐKCB|Mã vạch|Barcode).*?<td[^>]*>(.*?)</td>', h, re.DOTALL|re.IGNORECASE)
            if m:
                b["barcode"] = strip(m.group(1))
            
            # Store raw fields as fallback
            b["_raw"] = raw[:10]
            
            books.append(b)
        except Exception as e:
            errors += 1
            books.append({"bibid": bid, "error": str(e)})
        
        time.sleep(0.1)
    
    print(f"\n✅ Hoàn thành! {len(books)} sách, {errors} lỗi")
    
    # Save
    out = "extracted_books.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    print(f"💾 Đã lưu → {out}")
    
    # Stats
    wd = sum(1 for b in books if b.get("ddc"))
    ws = sum(1 for b in books if b.get("subject"))
    wa = sum(1 for b in books if b.get("author"))
    wt = sum(1 for b in books if b.get("title"))
    print(f"\n📊 Thống kê:")
    print(f"   Có tiêu đề: {wt}/{len(books)}")
    print(f"   Có tác giả: {wa}/{len(books)}")
    print(f"   Có DDC:     {wd}/{len(books)}")
    print(f"   Có chủ đề:  {ws}/{len(books)}")
    
    # Print first 5 as sample
    print(f"\n📖 Mẫu 5 cuốn đầu:")
    for b in books[:5]:
        print(f"   [{b.get('ddc','?')}] {b.get('title','?')} — {b.get('author','?')}")

if __name__ == "__main__":
    main()
