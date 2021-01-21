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

    private function deleteLogsInTxt()
    {
        $this->logFile = fopen('logs.txt', 'w+');
        fclose($this->logFile);
    }

    private function writeLogsInDB()
    {
        $strLogs = file('logs.txt');
        $prevTextSearchReques = '';
        for ($i = 0; $i < count($strLogs); $i++) {
            $str = trim($strLogs[$i]);
            $textData = explode("Дата: ", explode("Поисковый запрос", $str)[0])[1];
            $date = new DateTime($textData);
            $date = $date->format('Y-m-d H:i:s');
            $textSearchRequest = trim(explode("Поисковый запрос: ", explode("Кол-во найденных товаров", $str)[0])[1]);
            if ($prevTextSearchReques==$textSearchRequest){
                continue;
            }
            $textNumber = mb_substr($str, mb_strrpos($str, 'Кол-во найденных товаров: ') + mb_strlen('Кол-во найденных товаров: '));
            $number = (int)$textNumber;
            $sql = "INSERT INTO logs (date, request, number) VALUES (?,?,?)";
            $stmt = $this->mysqli->prepare($sql);
            $stmt->bind_param('ssi', $date, $textSearchRequest, $number);
            $stmt->execute();

            $prevTextSearchReques = $textSearchRequest;
        }
        $this->deleteLogsInTxt();

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

            if (in_array($_POST['click'], $_POST)) {
                if (!file_get_contents('logs.txt'))
                    echo "Заказов нет!";
                else{
                    $this->writeLogsInDB();
                    return "Логи записаны в БД";
                }

            }
            return $jsonData;




    }
}


$smartSearch = new Search($host, $user, $pass, $db);
echo $smartSearch->getResult();

