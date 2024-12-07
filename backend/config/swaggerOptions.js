const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "DentPlanner API",
      version: "1.0.0",
      description:
        "API de gestión de turno e historia clínica para sector odontológico",
    },
    servers: [
      {
        url: `${process.env.SERVER_URL}/api`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              example: "John",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
            dni: {
              type: "string",
              example: "40111333",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            phone_number: {
              type: "string",
              example: "3743562145",
            },
            password: {
              type: "string",
              example: "strongpassword123",
            },
            role_id: {
              type: "integer",
              example: 1,
            },
            active: {
              type: "boolean",
              example: true,
            },
            clinic_id: {
              type: "integer",
              example: 1,
            },
            /* image: {
              type: "string",
              format: "binary",
              description: "The image file to upload",
            }, */
          },
        },
        Patient: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              example: "Jane",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
            birth_date: {
              type: "string",
              format: "date",
              example: "1980-01-01",
            },
            dni: {
              type: "string",
              format: "string",
              example: "40111333",
            },
            phone_number: {
              type: "string",
              example: "+123456789",
            },
            alternative_phone_number: {
              type: "string",
              example: "+233456789",
            },
            email: {
              type: "string",
              example: "jane.doe@example.com",
            },
          },
          required: [
            "first_name",
            "last_name",
            "birth_date",
            "dni",
            "phone_number",
            "alternative_phone_number",
            "email",
          ],
        },
        Appointment: {
          type: "object",
          properties: {
            patient_id: {
              type: "integer",
              example: 1,
            },
            dentist_id: {
              type: "integer",
              example: 1,
            },
            reason_id: {
              type: "integer",
              example: 1,
            },
            date: {
              type: "string",
              format: "date",
              example: "2024-08-15",
            },
            time: {
              type: "string",
              format: "time",
              example: "07:30",
            },
            state: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "rescheduled"],
              example: "pending",
            },
            assistance: {
              type: "string",
              enum: ["pending", "present", "absent"],
              example: "pending",
            },      
            observations: {
              type: "string",
              example: "The pacient has scars",
            },
            anticipation_time: {
              type: "integer",
              example: 24,
            },
            is_active: {
              type: "boolean",
              example: true,
            },
          },
          required: [
            "patient_id",
            "dentist_id",
            "reason_id",
            "date",
            "time",
            "state",
          ],
        },      
        Reason: {
          type: "object",
          properties: {
            description: {
              type: "string",
              example: "Routine check-up",
            },
            time: {
              type: "string",
              format: "time",
              example: "00:30",
            },
          },
          required: ["description", "time"],
        },
        Auth: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              example: "strongpassword123",
            },
          },
          required: ["email", "password"],
        },
        ChangePassword: {
          type: "object",
          properties: {
            old_password: {
              type: "string",
              example: "oldpassword123",
            },
            new_password: {
              type: "string",
              example: "newpassword123",
            },
            confirm_password: {
              type: "string",
              example: "newpassword123",
            },
          },
          required: ["old_password", "new_password", "confirm_password"],
        },
        ForgotPassword: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
          },
          required: ["email"],
        },
        ResetPassword: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "jane.doe@example.com",
            },
          },
          required: ["email"],
        },
        Role: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "admin",
            },
          },
          required: ["id", "name"],
        },
        Reminder: {
          type: "object",
          properties: {
            appointment_id: {
              type: "integer",
              example: 101,
            },
            status: {
              type: "string",
              enum: ["sent", "delivered", "failed"],
              example: "sent",
            },
            response: {
              type: "string",
              enum: ["confirmed", "cancelled", "rescheduled"],
              example: "confirmed",
            },
            response_received_at: {
              type: "string",
              format: "date-time",
              example: "2024-07-31T13:00:00Z",
            },
          },
        },
        WhatsAppMessage: {
          type: "object",
          properties: {
            phoneNumber: {
              type: "string",
              description: "Número de teléfono del destinatario.",
            },
            clinicName: {
              type: "string",
              description: "Nombre de la clínica.",
            },
            appointmentDate: {
              type: "string",
              format: "date",
              description: "Fecha de la cita.",
            },
            appointmentTime: {
              type: "string",
              description: "Hora de la cita.",
            },
            dentistName: {
              type: "string",
              description: "Nombre del dentista.",
            },
            appointmentId: {
              type: "integer",
              description: "ID de la cita.",
            },
          },
        },
        ClinicInfo: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Odonto Clinic",
            },
            phone_number: {
              type: "string",
              example: "+1-234-567-8900",
            },
            address: {
              type: "string",
              example: "1234 Elm Street, Suite 100, Springfield",
            },
            email: {
              type: "string",
              example: "info@clinicexample.com",
            },
            opening_hours: {
              type: "string",
              format: "time",
              example: "08:00",
            },
            closing_hours: {
              type: "string",
              format: "time",
              example: "17:00",
            },
          },
        },
        ReminderConfiguration: {
          type: "object",
          properties: {
            appointment_id: {
              type: "integer",
              example: "1",
            },
            anticipation_time: {
              example: "12",
            },
            is_active: {
              type: "boolean",
              example: true,
            },
          },
        },
        Support: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              example: "Maurita",
            },
            last_name: {
              type: "string",
              example: "Perez",
            },
            phone_number:{ 
              type: "string",
              example: "3743562145" 
            },
            email: {
              type: "string",
              example: "mp@gmail.com",
            },
            issue_detail: {
              type: "string",
              example: "Sale humo de mi compu",
            },            
          },
          required:[
            "first_name",
            "last_name",
            "email",
          ]
        },       
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
