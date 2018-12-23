using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Server
{
    public static class IdentityDataSeeder
    {
        public static void SeedUsers(UserManager<IdentityUser> userManager)
        {
            const string defaultUserName = "admin";
            const string defaultUserPassword = "D1stributed$";

            if (userManager.FindByNameAsync(defaultUserName).Result == null)
            {
                var user = new IdentityUser(defaultUserName)
                {
                    Email = "admin@distributed-computing.com"
                };

                userManager.CreateAsync(user, defaultUserPassword).Wait();
            }
        }
    }
}
