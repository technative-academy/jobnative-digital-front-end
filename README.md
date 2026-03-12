# jobnative-digital-front-end
Front end of the Jobnative site

## API base URL
Set `VITE_API_BASE_URL` in `.env.local` to point the frontend at a different backend during development.

Example:
```bash
VITE_API_BASE_URL=http://localhost:3000/
```

## To Add shadcn/ui components
Install the relevant component:
```
npx shadcn@latest add button
```

Import the component into your project:
```
import { Button } from "@/components/ui/button"
```
