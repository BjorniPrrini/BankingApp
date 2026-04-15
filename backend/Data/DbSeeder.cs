using backend.Models;

namespace backend.Data{
    public static class DbSeeder{
        public static void Seed(AppDbContext context){
            if(context.Users.Any()){
                return;
            }

            var users = new List<User>{new User{
                    FullName = "Name 1",
                    Email = "Name1@test.com",
                    Balance = 1500.00m
                },
                new User{
                    FullName = "Name 2",
                    Email = "name2@test.com",
                    Balance = 2200.50m
                },
                new User{
                    FullName = "Name 3",
                    Email = "Name 3@test.com",
                    Balance = 980.75m
                }
            };

            context.Users.AddRange(users);
            
            context.SaveChanges();
        }
    }
}