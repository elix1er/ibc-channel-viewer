import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BellIcon, SearchIcon, WavesIcon } from '@/components/dapp/SvgIcons';

export function AppShell({ children, secondaryChild }: { children: React.ReactNode; secondaryChild: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-secondary-foreground text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-8">
            <WavesIcon className="mr-4 h-8 w-8" />
            <nav className="hidden space-x-6 md:flex">
              <a href="#" className="hover:underline">
                Tokenizin
              </a>
              <a href="#" className="active hover:underline">
                IBC Explore
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground" />
              <Input type="search" placeholder="Search" className="rounded-sm bg-white py-2 pl-10 pr-4 text-black" />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <BellIcon className="h-6 w-6 text-white" />
            </Button>
            {/* <Avatar>
              <AvatarImage src="/public/placeholder-user.jpg" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar> */}
          </div>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg drop-shadow-lg">
            <div className="">{children}</div>
          </div>
          <div className="rounded-lg drop-shadow-lg">
            <div className="">{secondaryChild}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
