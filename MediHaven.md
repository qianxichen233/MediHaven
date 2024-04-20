

# CS-UY 4523 MediHaven
---
### Project Description
This project is made for CS-UY 4523 (Design Project)
The main goal of this project is to develop a EHR software prototype that eventually helps improve the efficiency of healthcare related working procedures. The priority is the safety of the health records and tracking of the information:
1. Administrator:
	- Authenticates the user and logs them into the platform.
	- Generate a code for administrator and physician to register on their own
	- Unregister a physician
    - Allows the user to send message to other users
	- Allows the user to receive message from other users
2. Physician
	- Authenticates the user and logs them into the platform.
	- Allow the administrator to register a new account
	- Allow the patient to register a new account
	- Unregister a patient
	- Record the medical information into clinical history
	- Allows the physician to check the medicine list
	- Allows the user to send message to other users
	- Allows the user to receive message from other users
	- Give the prescription to this medicine
	- Allows the health worker to check the Insurance list
	- Collect data for demographics chart
	- Update the data of medicine
    - Update the data of insurance
3. Patient
	- Make schedule with a treatment
	- Authenticates the user and logs them into the platform.
	- Allow the student to register a new account.
	- Allows the user to send message to other users.
	- Allows the user to receive message from other users
    
### Project Showcase
Customer Login:

### Tech Stack
1. Frontend: Reactjs
2. Backend: Flask
3. Database: Mysql
4. User authentication: JWT
### Setup
1. Server Side (in server folder)
	- Make sure mysql server is opened at port 3306
	- run `mv .env.example .env` and replace your mysql credentials
	- run `pip3 install -r requirements.txt` to install all dependencies
	- run `python3 database_reset.py` to initialize the database
	- run `python3 server.py` to start the server
2. Client Side (in client folder)
	- run `yarn install` to install add dependencies
	- run `yarn start` to start development server
### Contributions
1. Qianxi Chen (qc815@nyu.edu)
	- 
	- 
2. Xiaoyi Yan (xy2089@nyu.edu)
	- 
	- 
### Special Thanks
1. 