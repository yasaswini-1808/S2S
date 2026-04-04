import asyncio
import httpx
import json

async def test():
    # Make a dummy PDF
    with open("dummy.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 21 >>\nstream\nBT\n/F1 12 Tf\n10 10 Td\n(Test Resume) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n284\n%%EOF")

    # Login to get token
    async with httpx.AsyncClient() as client:
        # Register a dummy user
        try:
            await client.post("http://localhost:8001/api/auth/register", json={"name": "test", "email": "test@test.com", "password": "test"})
        except: pass
        
        login_res = await client.post("http://localhost:8001/api/auth/login", json={"email": "test@test.com", "password": "test"})
        token = login_res.json()["access_token"]
        
        # Upload
        with open("dummy.pdf", "rb") as f:
            files = {"file": ("dummy.pdf", f, "application/pdf")}
            headers = {"Authorization": f"Bearer {token}"}
            res = await client.post("http://localhost:8001/api/resume/upload", files=files, headers=headers, timeout=30.0)
            print("STATUS:", res.status_code)
            print("RESPONSE:", res.text)

asyncio.run(test())
