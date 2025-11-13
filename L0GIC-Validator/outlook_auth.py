import msal
import os

CLIENT_ID = "your-client-id"
TENANT_ID = "your-tenant-id"
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
SCOPES = ["Calendars.ReadWrite"]

cache = msal.SerializableTokenCache()
if os.path.exists("token_cache.bin"):
    cache.deserialize(open("token_cache.bin", "r").read())

app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY, token_cache=cache)

accounts = app.get_accounts()
if accounts:
    result = app.acquire_token_silent(SCOPES, account=accounts[0])
else:
    result = app.acquire_token_interactive(SCOPES)

if "access_token" in result:
    with open("token_cache.bin", "w") as f:
        f.write(cache.serialize())