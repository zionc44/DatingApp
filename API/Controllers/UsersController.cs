﻿using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly DataContext context;
        public UsersController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public  async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await this.context.Users.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return await this.context.Users.FindAsync(id); ;
        }
    }
}
