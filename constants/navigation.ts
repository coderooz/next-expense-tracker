
import { LayoutDashboard, ArrowLeftRight, Tags, PieChart} from "lucide-react";

export const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Transactions', icon: ArrowLeftRight },
  { label: 'Categories', icon: Tags },
  { label: 'Reports', icon: PieChart },
] as const;
