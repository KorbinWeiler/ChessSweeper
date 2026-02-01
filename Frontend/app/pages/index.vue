<template>
  <v-app>
    <v-container class="pa-5" fluid fill-height>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="auto" class="text-center content">
          <v-btn to="/setupgame" color="primary" large>Start a new Game</v-btn>
          <h1>The History of Chess</h1>
          <p>
            The game of chess has a rich history that dates back over a thousand years. The earliest known form of chess cam from the 7th century CE
            in India where it was known as Chaturanga. which translates to "four divisions of the military" referring to the infantry, 
            cavalry, elephants, and chariots that were represented by the pieces on the board. These pieces would evolve over time into the modern
            pawn, knight, bishop, and rook. From India, the game spread to Persia where it was called Shatranj, and was a part of the princely or courtly
            education of Persian nobility. After the Islamic conquest of Persia, chess was introduced to the Muslim world and subsequently to Europe through
            the Iberian Peninsula during the Moorish occupation. After the Middle East, chess made its way to Europe, where it underwent significant changes in the 15th century,
            By the late 15th century, it had survived a series of prohibitions by the Catholic Church and had become a popular pastime among the European nobility. 
            The rules of chess were standardized in the 19th century, leading to the modern game we know today.
          </p>
          <h1>How To Improve The Game of Chess</h1>
          <p>
            Now that we know a little bit about the game of chess, it would be a safe argument to say that chess has become the best it could be.
            Like the humble crab, is there really any way to improve upon something so perfect? Well the answer is obviou. If we cannot improve it,
            we can certainly make it worse.
          </p>
          <h1>Making It Worse</h1>
          <p>
            My goal is to make with this game is to make sure everyone is having as little fun as I am (I am really bad at chess), and obviously
            the best way to make sure that nobody is having fun is bombs. So in this version of chess, there are bombs randomly placed on the board.
            If you move a piece onto a bomb, it explodes. This makes for a much more chaotic and unpredictable game of chess,
            where strategy takes a backseat to luck. So if you are looking for a way to make chess less fun, give this version a try!
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}
</style>