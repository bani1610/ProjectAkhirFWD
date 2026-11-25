<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureAuthorization();
    }

    /**
     * Pemilik kost mengelola seluruh data (PRD bagian 3), sehingga selalu
     * lolos pemeriksaan otorisasi. Mengembalikan null untuk peran lain agar
     * pemeriksaan dilanjutkan ke Policy masing-masing model.
     */
    private function configureAuthorization(): void
    {
        Gate::before(function (User $user): ?bool {
            return $user->isOwner() ? true : null;
        });
    }
}
