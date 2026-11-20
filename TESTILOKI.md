# Testiloki

Päivämäärä: 2026-11-19 10:21

## 1. Merkinnän lisäys (POST /api/addEntry), odotettu 201
HTTP/1.1 201 Created
Content-Type: application/json
Date: Thu, 19 Nov 2026 08:21:12 GMT
Server: Kestrel
Transfer-Encoding: chunked

{"id":"169d8bcf-0f58-455f-bf98-53bc80e8988d","date":"2026-11-19","place":"Oulu","note":"Testimerkinta","createdAt":"2026-11-19T08:21:12.236Z"}

## 2. Merkintöjen haku (GET /api/getEntries), odotettu 200
HTTP/1.1 200 OK
Content-Type: application/json
Date: Thu, 19 Nov 2026 08:21:12 GMT
Server: Kestrel
Transfer-Encoding: chunked

[{"id":"cdb1d76c-e032-471c-a079-b603dab625dd","date":"2026-11-19","place":"lapinlahden lintutorni","note":"hutera torni ja savuinen valion piippu","createdAt":"2026-11-19T08:18:42.936Z"},{"id":"169d8bcf-0f58-455f-bf98-53bc80e8988d","date":"2026-11-19","place":"Oulu","note":"Testimerkinta","createdAt":"2026-11-19T08:21:12.236Z"}]

## 3. Virheellinen pyyntö (puuttuvat tiedot), odotettu 400
HTTP/1.1 400 Bad Request
Content-Type: application/json
Date: Thu, 19 Nov 2026 08:21:13 GMT
Server: Kestrel
Transfer-Encoding: chunked

{"error":"Puuttuvat tai virheelliset tiedot: place, note."}