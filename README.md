Mô tả dự án
- Dự án được viết bằng Angular(FrontEnd) và SpringBoot(BackEnd API)
- Có các tính năng cơ bản Register, Login, CRUD user, Validation, Security Basic

Hướng dẫn chạy dự án
- Tạo database MySQL với câu lệnh trong file user_db.sql
- Folder crud_user_api là Spring Boot:
  + Load Maven project
  + Chỉnh sửa kết nối database trong file src/main/resources/application.properties(nếu cần)
  + Chỉnh sửa lại quyền truy cập api src/main/java/com.example.crud_user_api/security/SecurityConfig
- Tài khoản Admin mặc định:
	username: admin
	password: Admin@123
- Folder user_management là Angular:
  + Kiểm tra node -v, npm -v đã có hay chưa, nếu chưa có hãy tại ở https://nodejs.org/fr
  + Mở terminal, chạy câu lệnh npm install -g @angular/cli, sau đó kiểm tra ng version
  + Chạy lệnh npm install để tải node_module
  + Chỉnh sửa kết nối API tại src\app\api.service.ts (nếu cần)
- Chạy song song 2 chương trình Spring Boot và Angular
