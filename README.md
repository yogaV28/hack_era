# ZenT Application

This application provides an emergency response system with image-based emergency classification using a TensorFlow Lite model.

## Features

- Emergency situation detection using ML model
- Ambulance dispatch based on emergency type
- Ride booking service
- Grocery delivery service
- Package delivery service

## Setup Instructions

### Backend Setup

1. Make sure you have Python installed (Python 3.7+ recommended)

2. Install the required Python packages:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. Place your TensorFlow Lite model file in the root directory and name it `model.tflite`

4. Start the Flask server:
   \`\`\`bash
   python server.py
   \`\`\`
   The server will run on http://localhost:5000

### Frontend Setup

1. Make sure you have Node.js installed (v14+ recommended)

2. Install the required npm packages:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the Next.js development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   The application will run on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. You'll see a 30-second loading screen with the application logo
3. After loading, you'll be redirected to the login page
4. Login with the phone number: 6382176909 (any password will work for demo)
5. Navigate through the dashboard to access different services

## Emergency Classification

The application can detect four types of emergencies:
- Blood Loss
- Fire Burn
- Normal Faint
- Poison

Upload an image or use the webcam to capture and analyze emergency situations.

## Deployment

To deploy the application:

1. Build the Next.js application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

3. For the Flask backend, consider using Gunicorn for production:
   \`\`\`bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 server:app
   \`\`\`

## Customization

You can customize the application by:
- Updating the logo in `/public/logo.svg`
- Modifying the color scheme in `tailwind.config.ts`
- Adding more emergency types in the Flask server
