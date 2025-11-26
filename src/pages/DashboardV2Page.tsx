/**
 * Dashboard V2 Page
 * Página con dashboard personalizable
 */

import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardV2Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/gobierno">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <CustomizableDashboard />
      </div>
    </div>
  );
}
