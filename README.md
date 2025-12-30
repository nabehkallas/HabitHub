<b>
HabitHub
</b>  
is a sophisticated, cross-platform mobile application built with React Native (Expo). It is designed to help users bridge the gap between daily habit tracking and financial goals, allowing them to visualize how small lifestyle changes contribute to monthly savings.
<br>
<br>
<hr>
<div align="center">
<img src="./GIF_1.GIF" width="250" /> | <img src="./GIF_2.GIF" width="250" /> | <img src="./GIF_3.GIF" width="250" /> |
</div>
<hr>

<b>
The Mission</b>
Developed by Eng. Nabeh Kallas, HabitHub serves as a technical showcase of modern mobile development capabilities, focusing on performance optimization, clean UI/UX, and robust backend integration.\
<br>
<br>
<B>Key Features:</B>
<br>
<ul>
<li><b>Monetized Habits:</b> Users define habits (e.g., "Skipping takeout") and assign a monetary value saved per completion.</li>
<li><b>Icon Customization:</b>Personalize habits with a library of icons.</li>
<li><b>Financial Visualization:</b> Real-time Pie/Donut Charts that compare current savings against a set monthly goal.</li>
<li><b>Persistence:</b> State management that ensures users pick up exactly where they left off.</li>
</ul>
<br>
<br>
<b>Tech Stack & Engineering Highlights</b>
<br>
<ul>
<li><b>Framework:</b> React Native / Expo (Cross-platform iOS & Android).</li>
<li><b>UI Engine:</b> react-native-ui-lib (RNUI) for a high-quality, consistent component design.</li>
<li><b>Navigation:</b> Expo Router / Stack Navigation for seamless screen transitions.</li>
<li><b>Backend:  Firebase Auth:</b> Secure user authentication and profile management.

<b> Firestore:</b> Real-time NoSQL database.</li>
<li><b>AI Integration:</b> Developed with Gemini Code Assist for rapid prototyping and optimized logic.</li>
</ul>
<br>
<br>
<b>Technical Optimizations</b>
<ol>
<li><b>Server-Side Data Aggregation (getAggregateFromServer) </b>Instead of fetching thousands of habit entries and calculating totals on the client side (which drains battery and memory), HabitHub utilizes Firestore's Aggregate Queries.
<ul>
<li><b>How</b>By indexing the date field, we perform summation tasks directly on the Google Cloud servers.</li>
<li><b>Benefit</b>Reduces bandwidth usage and ensures the app remains snappy even with years of user data.</li>
</ul>
</li>
<li><b>Reliable State Persistence </b>Using the ReactNativePersistenceFunction with Firebase, the app maintains the user's authentication and operational state across sessions. This eliminates "flash of login screen" issues and improves the UX for returning users.</li>
<li><b>Data Visualization </b>Leveraging specialized charting libraries to transform raw Firestore data into intuitive Pie Charts, helping users visualize their progress toward their monthly goal at a glance</li>

</ol>
<br>
<br>
<b>Installation & Setup</b>
<ol>
<li>Clone the Repo: git clone https://github.com/your-username/HabitHub.git</li>
<li>Install Dependencies: npm install</li>
<li>Run the App: npx expo start</li>
</ol>
<br>
<br>
<br>
<b>Author</b>Eng. Nabeh Kallas Mobile Development Specialist 
