# PTUDWEB
Bài tập lớn môn PTUDW 

DEMO : https://anhcll.xyz/login
Link github: https://github.com/yuhbigd/PTUDWEB

Nhóm gồm 3 người :
 - Vi Quốc Thiện : Front end
 - Trần Quang Huy : Front end
 - Dương Thái Huy : Back end + deploy

Các công nghệ sử dụng : 
Front end: Reactjs + react redux
Backend : Nodejs + Expressjs + Mongodb + Redis

Mongodb và redis đều được dùng trên cloud nên không cần cài mongo hay redis trên máy.

Project này sử dụng docker để cho việc deploy.

Cách cài đặt project trên local: 

Sử dụng docker: 
  - Chạy express server : docker run -p 3001:3001 anhcll/ptudw-backend:local
  - Chạy React client : docker run -p 4200:80 anhcll/ptudw-client:local

Hoặc dùng project file: 
  - chạy lệnh : npm install trong 2 thư mục server và client
  - chạy lệnh : node index.js trong thư mục server
  - chạy lệnh : npm start trong thư mục client

Sau đó truy cập vào server thông qua: localhost:3001 và client thông qua localhost:4200