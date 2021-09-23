using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class LikesRepository : ILikesRepository

    {
        private readonly DataContext context;
        public LikesRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await this.context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = this.context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = this.context.Likes.AsQueryable();

            if (likesParams.predicate== "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.userId);
                users = likes.Select(like => like.LikedUser);
            }

            if (likesParams.predicate== "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesParams.userId);
                users = likes.Select(like => like.SourceUser);

            }

            var likedUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                knownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await this.context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }

    }
}
