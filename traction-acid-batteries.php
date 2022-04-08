<?php
global $filters, $filterStr, $where, $modx;   
    $filterStr = [];                                                // строка с условиями фильтрации для pdoPage
    $filters = [                                                    // фильтры на странице
        [
            'id' => 'fvoltage',                                     // id слоя с фильтрами в html и ключа в url
            'tv' => 'akb-v3-volt',                                  // имя tv (доп поля) в modx со значением фильтруемого параметра
            'values' => []                                          // значения парметров по которым будем фильтровать
        ],
        [
            'id' => 'fbrand',
            'tv' => 'akb-v3-brand-equipment',
            'values' => []
        ],
        [
            'id' => 'fcapacity',
            'tv' => 'akb-v3-amper',
            'values' => []
        ]
    ];
        
    // ! ------------------------------------------------------------------------------------------

    // проверим запущен ли фильтр
    if (isset($_REQUEST['fa'])) { if ($_REQUEST['fa'] === 'akb') { startFilter (); } }

    // если да, то запускаем работу фильтра
    function startFilter () {
        global $filters, $filterStr;

        getFilterValues();                                          // получим значения параметров фильтрации
        createConditionsFilter();                                   // сформируем условия фильтрации для сниппета pdoPage
        writeConditionsPlaceholder();                               // запишем условия в плейсхолдер
    }

    // получим значения параметров фильтрации
    function getFilterValues() {
        global $filters;

        // переберем фильтры
        foreach ($filters as &$filter) {                        
            $nameKey = $filter['id'];                               // имя ключа парметра в url
            
            if (isset($_REQUEST[$nameKey])) {                       // проверка есть ли такой парметр
                $arr = explode(" ", $_REQUEST[$nameKey]);           // разобьем строку параметров на массив
                $filter['values'] = $arr;                           // добавим значения параметров в данные фильтров
            }
        }
    }

    // сформируем условия фильтрации для сниппета pdoPage
    /* образец массива с данными для фильтрации
    $filterStr = [
        'akb-v3-volt:IN' => ['48V', '80V'],
        'akb-v3-brand-equipment:IN' => ['Balcancar', 'Still'], 
    ];*/    
    function createConditionsFilter() {
        global $filters, $filterStr;

        /* echo ("<pre>");
        print_r($filters);
        echo ("</pre>");*/

        foreach ($filters as $filter) {  
            $values = $filter['values'];
            $tvName = $filter['tv'] . ':IN';

            if (count($values) > 0) { $filterStr[$tvName] = $values; }
        }
    }

    // запишем условия в плейсхолдер
    function writeConditionsPlaceholder() {
        global $filterStr, $where, $modx; 
        
        $where = $modx->toJSON($filterStr);
        $modx->setPlaceholder('dop_filters-akb-v3', $where); 
    }