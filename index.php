<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/pictures/Cookie.png">
    <title>cookieclicker</title>
    <link rel="stylesheet" href="assets/css-files/main.css">
    <link id="themeColors" rel="stylesheet" href="assets/css-files/light-mode.css">
</head>
<body>
    <div class="sidemenus" id="sidemenu1">
        <div class="dropdown">
        <?php 
                // class Player{
                //     public $name;
                //     public int $health;
                //     public int $size;
                //     function __construct($name, $health, $size) {
                //         $this->name = $name;
                //         $this->health = $health;
                //         $this->size = $size;
                //       }
                //       function get_health() {
                //         return $this->health;
                //       }
                // }
                // $warlord420 = new player("warlord420", 100, 20);
                // echo $warlord420->get_health();
                // echo var_dump($warlord420)
                ?>
            <div class="side-header">
                <p>themes</p> 
            </div>
            <div class="dropdown-content themes">
                <div id="lightmode">
                    <img src="assets/pictures/Cookie.png" alt="cookie">
                    <p>lightmode</p>
                </div>
                <div id="darkmode">
                    <img src="assets/pictures/Cookie.png" alt="cookie">
                    <p>darkmode</p>
                </div>
                <div id="redmode">
                    <img src="assets/pictures/Cookie.png" alt="cookie">
                    <p>redmode</p>
                </div>
                <div>
                    <img src="assets/pictures/Cookie.png" alt="cookie">
                    <p>theme 4</p>
                </div>
                <div>
                    <img src="assets/pictures/Cookie.png" alt="cookie">
                    <p>theme 5</p>
                </div>
            </div>  
        </div>
        <div class="dropdown">
            <div class="side-header">
                <p class="skin_text">skins</p>
            </div>
            <div class="dropdown-content skins">
                <img class="pinata" id="pinata" src="assets/pictures/pinata.png" alt="a pinata">
                <img class="goldChain" id="chain" src="assets/pictures/pimp.png" alt="black piggy bank with gold chain">
                <img class="dropCookie" id="dropCookie" src="assets/pictures/Cookie.png" alt="cookie">
            </div>
        </div>
        <div class="dropdown">
            <div class="side-header">
                <p>botSpace</p>
            </div>
            <div class="dropdown-content botSpace">
                <div>
                    <img id="botSpace1" src="assets/pictures/landscapeBanner.png" alt="">
                </div>
                <div>
                    <img id="botSpace2" src="assets/pictures/bot.png" alt="">
                </div>
                <div>
                    <img id="botSpace3" src="assets/pictures/bot.png" alt="">
                </div>
                <div>
                    <img id="botSpace4" src="assets/pictures/bot.png" alt="">
                </div>
                <div>
                    <img id="botSpace5" src="assets/pictures/bot.png" alt="">
                </div>
                <div>
                    <img id="botSpace6" src="assets/pictures/bot.png" alt="">
                </div>
                <div>
                    <img id="botSpace7" src="assets/pictures/bot.png" alt="">
                </div>
            </div>
        </div>
    </div>
    <div class="cookieNcounter">
        <p class="counter" id="counter">0</p>
        <div class="container" id="botContainer">
            <img class="beams" id="beams" src="assets/pictures/lightBeams.png" alt="beams">
            <img class="cookie" id="cookie" src="assets/pictures/Cookie.png" alt="cookie">
        </div>
    </div>
    <div class="sidemenus" id="sidemenu2">
        <div class="dropdown">
            <div class="side-header">
                    <p>upgrades</p>
            </div>
            <div class="dropdown-content upgrades">
                <img id="2x-multiplier" class="item1" src="assets/pictures/2x_upgrade.png" alt="">
                <img id="3x-multiplier" class="item2" src="assets/pictures/Cookie.png" alt="">
                <img id="5x-multiplier" class="item3" src="assets/pictures/Cookie.png" alt="">
                <img id="10x-multiplier" class="item4" src="assets/pictures/Cookie.png" alt="">
                <img class="item5" src="assets/pictures/Cookie.png" alt="">
                <img class="item6" src="assets/pictures/Cookie.png" alt="">
                <img class="item7" src="assets/pictures/Cookie.png" alt="">
                <img class="item8" src="assets/pictures/Cookie.png" alt="">
            </div>
        </div>
        <div class="dropdown">
            <div class="side-header">
                <p>bots</p>
            </div>
            <div class="dropdown-content bots">
                <img id="addBotBtn" src="assets/pictures/cursor.png" alt="">
                <img id="bot1" src="assets/pictures/emoji.png" alt="">
                <img id="bot2" src="assets/pictures/bot.png" alt="">
                <img id="bot3" src="assets/pictures/bot.png" alt="">
                <img id="bot4" src="assets/pictures/bot.png" alt="">
                <img id="bot5" src="assets/pictures/bot.png" alt="">
                <img id="bot6" src="assets/pictures/bot.png" alt="">
                <img id="bot7" src="assets/pictures/bot.png" alt="">
            </div>
        </div>
        <div class="dropdown">
            <div class="side-header">
                <p>challenges</p>
            </div>
            <div class="dropdown-content challenges">
                <button id="startChallengeBtn">Start Challenge</button>   
            </div>
            <div id="challengeUI" style="display:none; text-align:center; margin: 1em;">
                <div id="challengeTimer" style="font-size: 1.5em; font-weight: bold;">Time: 20s</div>
                <div id="challengeClicks" style="font-size: 1.2em;">Clicks: 0 / 100</div>
            </div>
        </div>

    </div>
</body>
<script src="javascript/main.js"></script>
</html>












