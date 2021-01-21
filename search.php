<?php
require 'settings.php';

class Search
{
    private $mysqli;
    private $searchRequest;
    private $logFile;

    public function __construct($host, $user, $pass, $db)
    {
        if (isset($_POST['searchRequest'])){
            $this->searchRequest = $_POST['searchRequest'];
        }
        $this->mysqli = new mysqli($host, $user, $pass, $db);
        if ($this->mysqli->connect_error) {
            die('Error : (' . $this->mysqli->connect_errno . ') ' . $this->mysqli->connect_error);
        }

    }

    private function writeLogsInTxt($resultArr)
    {
        $this->logFile = fopen('logs.txt', 'a+');
        $currentDate = date('Y-m-d H:i:s');
        fwrite($this->logFile, 'Дата: ' . $currentDate . ' Поисковый запрос: ' . $this->searchRequest . ' Кол-во найденных товаров: ' . count($resultArr) . PHP_EOL);

    }


    public function getResult()
    {
        if ($this->searchRequest != null) {
            $result = $this->mysqli->query("SELECT name, number, price FROM goods WHERE name LIKE '%$this->searchRequest%' AND number>0 ");
            $resultArr = [];
            while ($row = $result->fetch_assoc()) {
                $resultArr[] = $row;
            }
            $jsonData = json_encode($resultArr, JSON_UNESCAPED_UNICODE);


            if(count($resultArr) != 0 && mb_strlen($this->searchRequest, 'utf-8') >= 3){
                $this->writeLogsInTxt($resultArr);

            }
        }


            return $jsonData;




    }
}


$smartSearch = new Search($host, $user, $pass, $db);
echo $smartSearch->getResult();

