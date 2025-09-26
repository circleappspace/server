import sys
import requests
import json
import xml.dom.minidom

def parse_http_file(path):
    method = None
    url = None
    headers = {}
    body_lines = []
    in_body = False

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line.strip():
                in_body = True
                continue

            if not method:
                parts = line.split(" ", 1)
                method, url = parts[0], parts[1]
                # URL에 http:// 자동 보정
                if not url.startswith("http://") and not url.startswith("https://"):
                    url = "http://" + url
            elif not in_body:
                if ":" in line:
                    k, v = line.split(":", 1)
                    headers[k.strip()] = v.strip()
            else:
                body_lines.append(line)

    body = "\n".join(body_lines) if body_lines else None
    return method, url, headers, body


def pretty_print_response(response):
    ctype = response.headers.get("Content-Type", "")
    text = response.text

    # JSON 응답 포맷팅
    if "application/json" in ctype:
        try:
            parsed = json.loads(text)
            print(json.dumps(parsed, indent=2, ensure_ascii=False))
            return
        except Exception:
            pass

    # XML 응답 포맷팅
    if "xml" in ctype:
        try:
            dom = xml.dom.minidom.parseString(text)
            print(dom.toprettyxml())
            return
        except Exception:
            pass

    # 그 외는 그냥 출력
    print(text)


def main():
    if len(sys.argv) < 2:
        print("Usage: python rest_client.py <request.http>")
        sys.exit(1)

    method, url, headers, body = parse_http_file(sys.argv[1])
    print(f"➡️ {method} {url}")
    if headers:
        print(f"Headers: {headers}")
    if body:
        print(f"Body: {body}")

    response = requests.request(method, url, headers=headers, data=body)

    print("\n📥 Response:")
    print(f"Status: {response.status_code}")
    pretty_print_response(response)


if __name__ == "__main__":
    main()
