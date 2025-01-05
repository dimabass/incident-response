#### **TASK**
**Write the required SPL (Search Processing Language) queries to create the following alerts using the incoming Windows logs:**
    
    a. Windows Account Creating
    
    b. Windows Account Deleting
    
    c. Windows Audit Log Tampering
    
    d. Detecting brute force attack
    
    e. "whoami" command detection
    
    f. Scheduled task created


**Before starting, we ensure the following:**

- Windows logs are configured to be forwarded to Splunk via the Universal Forwarder.
    
- Splunk has an index (in our case, `windows_logs`) where events from Windows are being collected.
    
- We have access to alert settings and, if needed, integration with Slack.
    

---

#### **Creating and Testing Alerts**

---
![](resources/175ce630f6ceac02f42f1edbec13f99d.png)

![](resources/e61b8bc669860ca7608fcb6bec87c671.png)
<div class="page-break"></div>
### **a. Alert: Windows Account Creation**

1. **Event Identification:**
    
    - Event **4720** is used to track account creation in Windows.
2. **Search Query:**

```spl
source="WinEventLog:*" index="windows_logs" EventCode=4720
```

   
3. **Alert Configuration:**

- Creating an alert is simple—just save the query as an alert. 
     ![](resources/93fa320f853f8212e909fbef74e987df.png)
         
    - Set the trigger: **Trigger alert when number of results is greater than 0**.
    
- Configure actions (e.g., sending notifications to Slack, etc.).
    
    ![](resources/bc4ababd355a2f7e63756c2a6fc958cc.png)

4. **Testing:**

- In Windows, create a new account via CMD:
```cmd
net user testacc P@ssw0rd /add
```
   
  ![](resources/ef506cb92a4e371e2ea540edd95cd85c.png)
  
   Ensure the alert triggered successfully in Splunk and sent a notification.
   
   ![](resources/d90fdde553da8eade6f509b4713cb380.png)![](_resources/4dc00a194b1ca1fa6a0416b3d5258911.png)

---

### **b. Alert: Windows Account Deletion**

1. **Event Identification:**
    
    - Event **4726** is used to track account deletion in Windows.
2. **Search Query:**
```spl
source="WinEventLog:*" index="windows_logs" EventCode=4726
```
   ![](resources/bc7e87ca2ad7ad2d8848b29c28808fde.png)
   
3. **Alert Configuration:** Same as in "a."
    
4. **Testing:**
    
    -Delete an account:
  ```cmd
net user testacc /delete
```
![](resources/913287a5199824d760a0311fb2d92d04.png)
    - Verify the alert detected the deletion.
       ![](resources/e7644ea875a7b6321bba865a3fd6ed7f.png)
    

---

### **c. Alert: Audit Log Tampering**

1.  **Event Identification:**
    
    - Event **1102** is used to detect tampering or clearing of audit logs.
2.  **Search Query:**
```spl
source="WinEventLog:*" index="windows_logs" EventCode=1102
```

![](resources/bacf76a43d14b04f4246899ea5e43012.png)
3. **Alert Configuration:** Same as previous cases.
    
4. **Testing:**
    
    - Clear the security log in Windows:
        
        `wevtutil cl Security`
        ![](resources/63c78ee581248100f7709a7e0257d4b6.png)
    - Verify the alert detected the activity.
    ![](resources/071012654a7f89be2944c13706ee6b20.png)

---

![](resources/4b6641b012141781ae5f88111e7f6601.png)

### **d. Alert: Detecting Brute Force Attacks**

1. **Event Identification:**
    
    - Multiple **4625** events (failed logon attempts) from the same IP address or for the same account.
2. **Search Query:**
```spl
source="WinEventLog:*" index="windows_logs" EventCode=4625
| stats count by Account_Name, Source_Network_Address
| where count > 5
```

![](resources/e1948c0abfd0500e8af1ef17ebee9e16.png)
    
3. - **Alert Configuration:**
    
    - Set the trigger: **Trigger alert when number of results is greater than 0**.
4. **Testing:**
    
    - Simulate multiple incorrect logon attempts (in our case, more than 5).
        
    - Verify the alert detected suspicious activity.
    ![](resources/0762456f24fed5b927439ba0576c6256.png)
    ![](resources/7cdcad516b08fd0cdab6f8d1e3bc8323.png)
    
---

### **e. Alert: Detecting the Command "whoami"**

1. **Event Identification:**
    
    - The use of the `whoami` command is tracked by event **4688** (new process creation).
2. **Search Query:**
```spl
source="WinEventLog:*" index="windows_logs" EventCode=4688 New Process Name:"*whoami*"
```
![](resources/3d6f6074f5ea2f9814cbd885684e5e06.png)

3.  - **Alert Configuration:** Same as previous cases.
    
4.  **Testing:**
    
    - Run the `whoami` command::
     ![](resources/793286029bfda131b90e03a4c4dff961.png)  
    
    - Verify the alert detected the command execution.
    ![](resources/416e1a9eedf006e15f8451f4f97a597f.png)
    ![](resources/1b400a778c63fa73f32d83b103c9e236.png)
    
---

### **f. Alert: Scheduled Task Creation**

1. **Event Identification:**
    
    - Event **4698** is used to detect new scheduled tasks.
2. **Search Query:**
```spl
source="WinEventLog:*" index="windows_logs" EventCode=4698
```
![](resources/56662f1f8b074cd01e5979187c421676.png)

3. **Alert Configuration:** Same as previous cases.
    
4. **Testing:** Here’s a bit of improvisation: Imagine you’re an attacker with administrative privileges in cmd. Use the following commands to generate a `.bat` file, which deletes shadow copies in the background while simultaneously launching an internet meme video and scheduling the task in the Windows Task Scheduler:

```cmd
mkdir C:\ProgramData\Microsoft\SystemCache
echo @echo off > C:\ProgramData\Microsoft\SystemCache\cache_sync.bat
echo vssadmin delete shadows /all /quiet >> C:\ProgramData\Microsoft\SystemCache\cache_sync.bat
echo start "" "https://www.youtube.com/watch?v=dQw4w9WgXcQ" >> C:\ProgramData\Microsoft\SystemCache\cache_sync.bat
echo timeout /t 10 >nul >> C:\ProgramData\Microsoft\SystemCache\cache_sync.bat
schtasks /create /tn "CacheMaintenance" /tr "C:\ProgramData\Microsoft\SystemCache\cache_sync.bat" /sc onlogon /rl highest
```

![](resources/431bf590c95d447e2d2a940fb9752fde.png)
![](resources/f50015c0041c7e8a058bb6c27e19930e.png)

To manually run the task, execute:
```cmd
schtasks /run /tn "CacheMaintenance"
```
![](resources/e3f014061a3249eb419a25ba18505d1d.png)`

   - Verify the alert detected the event.
   ![](resources/995c4b36f28c3350f9e717ad9ae42ef1.png)

---

### **3. Integration with Slack (Optional)**

To make things easier, you can integrate Splunk with Slack:

- Install the **Slack App for Splunk** in Splunk.
    
- Configure the webhook in Slack.
    
- Link notifications from Splunk to the created alerts.
    ![](resources/fde4b144aac3d38c33884ef366a932eb.png)
    ![](resources/b212afe0a189fcc028583b69e569bed8.png)
