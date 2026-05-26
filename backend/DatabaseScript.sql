DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE Users (
                       id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       name VARCHAR(50) NOT NULL,
                       surname VARCHAR(50) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role TEXT NOT NULL
                           CHECK (role IN ('admin', 'banker', 'client')),
                       dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Employee (
                          id INT NOT NULL PRIMARY KEY,
                          employee_id INT UNIQUE,
                          salary DECIMAL(10,2) NOT NULL,
                          CONSTRAINT fk_employee_user
                              FOREIGN KEY (id)
                                  REFERENCES Users(id)
                                  ON DELETE CASCADE
);

CREATE TABLE Client (
                        id INT NOT NULL PRIMARY KEY,
                        client_id INT GENERATED ALWAYS AS IDENTITY (START WITH 100000 INCREMENT BY 1) UNIQUE,
                        accountNumber VARCHAR(20) NOT NULL UNIQUE,
                        balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                        CONSTRAINT fk_client_user
                            FOREIGN KEY (id)
                                REFERENCES Users(id)
                                ON DELETE CASCADE
);

CREATE TABLE TransactionHistory (
                                    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                    senderID INT NOT NULL,
                                    receiverID INT NOT NULL,
                                    amount DECIMAL(10,2) NOT NULL,
                                    status TEXT NOT NULL DEFAULT 'completed'
                                        CHECK (status IN ('completed', 'failed')),
                                    transactionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    CHECK (senderID <> receiverID),
                                    CONSTRAINT fk_transaction_sender
                                        FOREIGN KEY (senderID)
                                            REFERENCES Client(id)
                                            ON DELETE CASCADE,
                                    CONSTRAINT fk_transaction_receiver
                                        FOREIGN KEY (receiverID)
                                            REFERENCES Client(id)
                                            ON DELETE CASCADE
);

CREATE TABLE Notifications (
                               id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                               userID INT NOT NULL,
                               type TEXT NOT NULL
                                   CHECK (
                                       type IN (
                                                'transaction_sent',
                                                'transaction_received',
                                                'transaction_failed',
                                                'balance_updated',
                                                'login_detected'
                                           )
                                       ),
                               message VARCHAR(255) NOT NULL,
                               isRead BOOLEAN DEFAULT FALSE,
                               createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT fk_notif_user
                                   FOREIGN KEY (userID)
                                       REFERENCES Users(id)
                                       ON DELETE CASCADE
);

CREATE TABLE AuditLog (
                          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          userID INT NOT NULL,
                          action TEXT NOT NULL
                              CHECK (
                                  action IN (
                                             'create_user',
                                             'delete_user',
                                             'update_user',
                                             'create_client',
                                             'delete_client',
                                             'update_client',
                                             'update_balance',
                                             'create_transaction',
                                             'login',
                                             'logout'
                                      )
                                  ),
                          description VARCHAR(255),
                          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_audit_user
                              FOREIGN KEY (userID)
                                  REFERENCES Users(id)
                                  ON DELETE CASCADE
);

CREATE INDEX idx_transaction_sender ON TransactionHistory(senderID);
CREATE INDEX idx_transaction_receiver ON TransactionHistory(receiverID);
CREATE INDEX idx_transaction_sender_receiver ON TransactionHistory(senderID, receiverID);
CREATE INDEX idx_transaction_timestamp ON TransactionHistory(transactionTimestamp);
CREATE INDEX idx_notifications_user ON Notifications(userID);
CREATE INDEX idx_auditlog_user ON AuditLog(userID);

INSERT INTO Users (name, surname, email, password, role)
VALUES (
           'Admin',
           'User',
           'admin@goldstone.com',
           '$2a$11$KPjFnzvZ/JCI0EnZIy8n.eX90QW4gZAA5Ufrelxlq1coJBfV/bWU2',
           'admin'
       );

INSERT INTO Employee (id, employee_id, salary)
VALUES (
           (SELECT id FROM Users WHERE email = 'admin@goldstone.com'),
           100001,
           5000.00
       );