<?php
require 'settings.php';

    class Search
    {
        private  $mysqli;
        public function __construct($host, $user, $pass, $db)
        {
            $this->mysqli = new mysqli($host, $user, $pass, $db);
            if ($this->mysqli->connect_error) {
                die('Error : ('. $this->mysqli->connect_errno .') '. $this->mysqli->connect_error);
            }

        }
        public function getResult($searchRequest){
            $result = $this->mysqli->query("SELECT name, number, price FROM goods WHERE name LIKE '%$searchRequest%' AND number>0 ");
            $resultArr=[];
            while ($row = $result->fetch_assoc()) {
                //var_dump($row) ;
                $resultArr[] = $row;
            }
             $jsonData = json_encode($resultArr,JSON_UNESCAPED_UNICODE);
            return $jsonData;
        }
    }

$searchRequest = $_POST['searchRequest'];
$smartSearch = new Search($host, $user, $pass, $db);
echo $smartSearch->getResult($searchRequest);

