# IBC Info Explorer

IBC Info Explorer is a React-based web application that allows users to fetch and explore Inter-Blockchain Communication (IBC) data from various blockchain networks. This tool is particularly useful for developers and enthusiasts that want to explore IBC channels and their associated data.

## Features

- Select from multiple blockchain networks
- Choose REST endpoints for each selected chain
- Filter and display IBC channels
- Option to show only transfer channels
- Fetch and display detailed IBC data for selected channels

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Radix UI for accessible components
- Monaco Editor for JSON display
- Chain Registry Client for blockchain data

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm

### Installation

1. Clone the repository:
   ```

   git clone <https://github.com/elix1er/ibc-channel-viewer.git>

   ```

2. Navigate to the project directory:
   ```

   cd ibc-channel-viewer

   ```

3. Install dependencies:
   ```

   yarn install

   ```
   or
   ```

   npm install

   ```

### Running the Application

To start the development server:

```

yarn dev

```
or
```

npm run dev

```

The application will be available at `http://localhost:5173`.

## Usage

1. Select a blockchain network from the dropdown menu.
2. Choose a REST endpoint for the selected network.
3. Optionally, toggle the switch to show only transfer channels.
4. Select an IBC channel from the list.
5. Click "Fetch IBC Data" to retrieve and display the channel information.

## Building for Production

To create a production build:

```

yarn build

```
or
```

npm run build

```

## Deployment

This project is configured for deployment on GitHub Pages. To deploy:

```

yarn deploy

```
or
```

npm run deploy

```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
