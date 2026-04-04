import asyncio
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient

async def test_all():
    print("Testing bcrypt...")
    try:
        pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
        h = pwd_context.hash('test')
        print("Bcrypt OK:", h)
    except Exception as e:
        print("Bcrypt Error:", repr(e))
        
    print("Testing MongoDB...")
    try:
        client = AsyncIOMotorClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
        await client.server_info()
        print("MongoDB OK")
    except Exception as e:
        print("MongoDB Error:", repr(e))

if __name__ == "__main__":
    asyncio.run(test_all())
