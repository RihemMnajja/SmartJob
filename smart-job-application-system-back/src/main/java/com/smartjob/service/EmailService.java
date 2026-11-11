package com.smartjob.service;


import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import jakarta.mail.internet.MimeMessage;



@Service
public class EmailService {


    private final JavaMailSender mailSender;



    public EmailService(JavaMailSender mailSender) {

        this.mailSender = mailSender;

    }





    public void sendEmail(
            String to,
            String subject,
            String body
    ) {


        try {


            MimeMessage message =
                    mailSender.createMimeMessage();



            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true
                    );



            helper.setFrom(
                    "smartjob.support@gmail.com"
            );



            helper.setTo(to);



            helper.setSubject(subject);



            helper.setText(
                    body,
                    true
            );



            mailSender.send(message);



            System.out.println(
                    "✅ Email envoyé avec succès à : "
                            + to
            );



        }
        catch(Exception e){


            System.out.println(
                    "❌ Erreur envoi email"
            );


            e.printStackTrace();

        }


    }



}