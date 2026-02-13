<template>
  <v-card 
      class="mx-auto index-card">
    <v-row align="center" justify="center" class="fill-height">
        <v-col cols="auto" class="text-center content">
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
    </v-card>
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
.index-card {
  padding: 2.5rem;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.button-group {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .index-card {
    padding: 1rem;
  }
  .content {
    padding: 0 12px;
  }
  .content h1 {
    font-size: 1.5rem;
  }
  .content p {
    font-size: 0.9rem;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .mt-2-mobile {
    margin-left: 0 !important;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .index-card {
    padding: 0.5rem;
    margin: 0.25rem;
    width: calc(100vw - 0.5rem);
    max-width: 100%;
  }
  .content {
    padding: 0 8px;
  }
  .content h1 {
    font-size: 1.3rem;
  }
  .content p {
    font-size: 0.85rem;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .mt-2-mobile {
    margin-left: 0 !important;
    margin-top: 0.5rem;
  }
}

@media (max-width: 430px) {
  .index-card {
    padding: 0.5rem;
    margin: 0.25rem;
    width: calc(100vw - 0.5rem);
    max-width: 100%;
  }
  .content {
    padding: 0 6px;
  }
  .content h1 {
    font-size: 1.2rem;
  }
  .content p {
    font-size: 0.8rem;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .mt-2-mobile {
    margin-left: 0 !important;
    margin-top: 0.5rem;
  }
}
</style>