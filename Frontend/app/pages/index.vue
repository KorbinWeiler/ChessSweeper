<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4" class="pa-6 pa-md-10 rounded-lg">
          <v-card-text>
            <div class="d-flex flex-column flex-sm-row ga-3 mb-8 justify-center">
              <v-btn to="/setupgame" color="primary" size="large" variant="elevated">Start a new Game</v-btn>
              <v-btn to="/stats" color="secondary" size="large" variant="elevated">View Stats</v-btn>
            </div>

            <div class="text-h5 text-md-h4 font-weight-bold mb-3">The History of Chess</div>
            <p class="text-body-1 mb-6">
              The game of chess has a rich history that dates back over a thousand years. The earliest known form of chess came from the 7th century CE
              in India where it was known as Chaturanga, which translates to "four divisions of the military" referring to the infantry,
              cavalry, elephants, and chariots that were represented by the pieces on the board. These pieces would evolve over time into the modern
              pawn, knight, bishop, and rook. From India, the game spread to Persia where it was called Shatranj, and was a part of the princely or courtly
              education of Persian nobility. After the Islamic conquest of Persia, chess was introduced to the Muslim world and subsequently to Europe through
              the Iberian Peninsula during the Moorish occupation. After the Middle East, chess made its way to Europe, where it underwent significant changes in the 15th century.
              By the late 15th century, it had survived a series of prohibitions by the Catholic Church and had become a popular pastime among the European nobility.
              The rules of chess were standardized in the 19th century, leading to the modern game we know today.
            </p>

            <div class="text-h5 text-md-h4 font-weight-bold mb-3">How To Improve The Game of Chess</div>
            <p class="text-body-1 mb-6">
              Now that we know a little bit about the game of chess, it would be a safe argument to say that chess has become the best it could be.
              Like the humble crab, is there really any way to improve upon something so perfect? Well the answer is obvious. If we cannot improve it,
              we can certainly make it worse.
            </p>

            <div class="text-h5 text-md-h4 font-weight-bold mb-3">Making It Worse</div>
            <p class="text-body-1">
              My goal with this game is to make sure everyone is having as little fun as I am (I am really bad at chess), and obviously
              the best way to make sure that nobody is having fun is bombs. So in this version of chess, there are bombs randomly placed on the board.
              If you move a piece onto a bomb, it explodes. This makes for a much more chaotic and unpredictable game of chess,
              where strategy takes a backseat to luck. So if you are looking for a way to make chess less fun, give this version a try!
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios'

async function viewStats() {
  try {
    const response = await axios.get('https://localhost:7144/stats')
    const data = response.data
    let statsMessage = `Total Explosions: ${data.totalExplosions}\n` +
                       `White Pieces Explosioned: ${data.whiteExplosions}\n` +
                       `Black Pieces Explosioned: ${data.blackExplosions}\n` +
                       `Explosions by Piece Type:\n`;
    (data.numberExplodedByPiece || []).forEach(item => {
      statsMessage += `  ${item.pieceType}: ${item.count}\n`;
    });
    alert(statsMessage);
  } catch (error) {
    console.error('Error fetching stats:', error);
    alert('Failed to fetch stats. Please try again later.');
  }
}
</script>

<style scoped>
/* All styling handled by Vuetify utility classes */
</style>