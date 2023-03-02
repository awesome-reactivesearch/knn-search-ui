from json import loads
from requests import post

WSTREAM = open("written.txt", "r")
written = WSTREAM.read().split("\n")[:-1]


file = "reviews.json"
UPSTREAM_URL = "http://foo:bar@localhost:8000"

content = open(file, "r").read()
json_content = loads(content)

succesfull_index = 0


def update_index():
    for doc in json_content:
        if str(doc["ID"]) in written:
            print(f"Skipping {doc['Name']} since it's already added")
            continue

        url = f"{UPSTREAM_URL}/app-store-data/_doc"
        r = post(url, headers={"Content-Type": "application/json"}, json=doc)

        if r.status_code != 201:
            print(f"Failed to index: {doc}")
            continue

        print(f"Indexed: {doc['Name']}")
        global succesfull_index
        succesfull_index += 1

        written.append(str(doc["ID"]))


if __name__ == "__main__":
    try:
        update_index()
    except Exception:
        open("written.txt", "w").write("\n".join(written))
        print(f"{succesfull_index} done, {len(json_content) - succesfull_index} failed")
