<?php

    function getAllapplications(){
        $query = db_select("SELECT * FROM [application] WHERE");
        $res = db_fetch_array($query);
        echo json_encode($res);
    }

    function getApplication($id){
        $query = db_select("SELECT * FROM [application] WHERE id = $id");
        $res = db_fetch_array($query);
        $query2 = db_select("SELECT * FROM appform WHERE appid = $id");
        $form_ids = array();
        $i = 0;
        while($res2 = db_fetch_array($query2)){
            $form_ids[$i] = $res2["form_id"];
            $i++;
        }
        $query = db_select("SELECT * FROM form WHERE id IN (".implode(",",$form_ids).")");
        $i = 0;
        while($res2 = db_fetch_array($query)){
            if($res2["type"] == "select" || $res2["type"] == "radio"){
                $query3 = db_select("SELECT * FROM select WHERE form_id = ".$res2["id"]);
                $j = 0;
                while($res3 = db_fetch_array($query3)){
                    $res["forms"][$i]["options"][$j] = $res3["value"];
                    $j++;
                }
            }else{
                $res["forms"][$i] = $res2;
                $i++;
            }
        }
        
        echo json_encode($res);
    }

    function createApplication(){
        $data = json_decode(file_get_contents("php://input"));
        $query = db_select("INSERT INTO application (title, subtitle, start, stop, desc, cvr, contact, tlf, mail) VALUES ($data->title, $data->subtitle, $data->start, $data->stop, $data->desc, $data->cvr, $data->contact, $data->tlf, $data->mail)");
        $id = db_insert_id();
        $query = db_select("INSERT INTO adminapp (admin_id, app_id) VALUES ($_SESSION[id], $id)");
        foreach($data->forms as $form){
            if($form->type == "select" || $form->type == "radio"){
                $query = db_select("INSERT INTO form ([type], label, [required]) VALUES ($form->type, $form->label, $form->required)");
                $form_id = db_insert_id();
                foreach($form->options as $option){
                    $query = db_select("INSERT INTO [select] (form_id, [value]) VALUES ($form_id, $option)");
                }
                $query = db_select("INSERT INTO appform (appid, form_id) VALUES ($id, $form_id)");
            }else{
                $query = db_select("INSERT INTO form ([type], label, [required]) VALUES ($form->type, $form->label, $form->required)");
                $form_id = db_insert_id();
                $query = db_select("INSERT INTO appform (appid, form_id) VALUES ($id, $form_id)");
            }
        }
        if($query)
            echo json_encode(array("status" => "Success"));
        else
            echo json_encode(array("status" => "Error"));
    }
    
    function getTitle(){
        $data = json_decode(file_get_contents("php://input"));
        $query = db_select("SELECT * FROM titles WHERE id = $data->id");
        $res = db_fetch_array($query);
        echo json_encode($res);
    }

    function login(){
        $data = json_decode(file_get_contents("php://input"));
        $query = db_select("SELECT * FROM [admin] WHERE email = $data->email");
        if(password_verify($data->password, $res["password"])){
            $res = db_fetch_array($query);
            $_SESSION["id"] = $res["id"];
            $_SESSION["token"] = generateRandomString();
            echo json_encode(array("status" => "Success", "token" => $_SESSION["token"]));
        }else{
            if(db_num_rows($query) < 1){
                echo json_encode(array("status" => "Error", "message" => "Email not found"));
            }
            echo json_encode(array("status" => "Error", "message" => "Wrong password"));
        }
    }

    function generateRandomString($length = 18) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    function logout(){
        session_destroy();
        echo json_encode(array("status" => "Success"));
    }

    function applicantLogin(){
        $data = json_decode(file_get_contents("php://input"));
        $query = db_select("SELECT * FROM applicant WHERE medlemsnummer = $data->medlemsnummer");;
        $_SESSION["navn"] = $data->navn;
        $_SESSION["klub"] = $data->klub;
        $_SESSION["distrikt"] = $data->distrikt;
        $_SESSION["medlemsnummer"] = $data->medlemsnummer;
        $_SESSION["email"] = $data->email;
        $_SESSION["tlf"] = $data->tlf;
        $_SESSION["token"] = generateRandomString();
        if(db_num_rows($query) > 0){
            $res = db_fetch_array($query);
            $_SESSION["id"] = $res["id"];
            echo json_encode(array("status" => "Success", "token" => $_SESSION["token"]));
        }else{
            $query = db_select("INSERT INTO applicant (medlemsnummer, navn, distrikt, klub, email, tlf) VALUES ($data->medlemsnummer, $data->navn, $data->distrikt, $data->klub, $data->email, $data->tlf)");
            if($query){
                $_SESSION["id"] = db_insert_id();
                echo json_encode(array("status" => "Success", "token" => $_SESSION["token"]));
            }else{
                echo json_encode(array("status" => "Error"));
            }
        }
    }

    function createLogin(){
        $data = json_decode(file_get_contents("php://input"));
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $query = db_select("INSERT INTO [admin] (email, [password]) VALUES ($data->email, $password)");
        if($query){
            echo json_encode(array("status" => "Success"));
        }else{
            echo json_encode(array("status" => "Error"));
        }
    }

    function getFiles(){
        $query = db_select("SELECT * FROM files WHERE appid = $_SESSION[id]");
        while($res = db_fetch_array($query))
            $files[] = $res["file_name"];
        
        if(db_num_rows($query) > 0)
            echo json_encode($files);
        else
            echo json_encode(array("message" => "No files found"));
    }
?>
