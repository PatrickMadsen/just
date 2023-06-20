<?php

    function getAllapplications(){
        $query = db_select("SELECT * FROM application WHERE");
        $res = db_fetch_array($query);
        echo json_encode($res);
    }

    function getApplication($id){
        $query = db_select("SELECT * FROM application WHERE id = $id");
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
            if($res2["type"] == "select"){
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
        foreach($data->forms as $form){
            if($form->type == "select"){
                $query = db_select("INSERT INTO form (type, label, required) VALUES ($form->type, $form->label, $form->required)");
                $form_id = db_insert_id();
                foreach($form->options as $option){
                    $query = db_select("INSERT INTO select (form_id, value) VALUES ($form_id, $option)");
                }
                $query = db_select("INSERT INTO appform (appid, form_id) VALUES ($id, $form_id)");
            }else{
                $query = db_select("INSERT INTO form (type, label, required) VALUES ($form->type, $form->label, $form->required)");
                $form_id = db_insert_id();
                $query = db_select("INSERT INTO appform (appid, form_id) VALUES ($id, $form_id)");
            }
        }
        if($query)
            echo json_encode(array("status" => "Success"));
        else
            echo json_encode(array("status" => "Error"));
    }
    
?>